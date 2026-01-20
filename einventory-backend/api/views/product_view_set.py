from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.core.exceptions import ValidationError as DjangoValidationError

from api.models.product import Product
from api.serializers.product_serializer import (
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer
)

# Importando os múltiplos serviços
from api.services.inventory_service import InventoryService
from api.services.product_service import ProductService
from api.services.report_service import ReportService


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category', 'created_by').filter(is_active=True)
    # permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'sku', 'description']
    ordering_fields = ['name', 'price', 'quantity', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer

    def perform_create(self, serializer):
        """Usa o ProductService para centralizar a criação"""
        try:
            # Pegando os dados validados do serializer e passamos para o serviço
            validated_data = serializer.validated_data
            ProductService.create_product(data=validated_data, user=self.request.user)
        except DjangoValidationError as e:
            from rest_framework.exceptions import ValidationError as DRFValidationError
            raise DRFValidationError(e.message_dict)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response({'message': 'Desativado com sucesso'}, status=status.HTTP_204_NO_CONTENT)


    # --- ACTIONS DE NEGÓCIO (InventoryService) ---

    @action(detail=False, methods=['post'])
    def bulk_update_prices(self, request):
        category_id = request.data.get('category_id')
        percentage = request.data.get('percentage', 0)

        if not category_id:
            return Response({'error': 'category_id obrigatório'}, status=400)

        count = InventoryService.bulk_update_prices(category_id, percentage)
        return Response({'message': f'{count} produtos atualizados', 'count': count})

    @action(detail=True, methods=['post'])
    def transfer_stock(self, request, pk=None):
        """Action para usar a transferência"""
        to_product_id = request.data.get('to_product_id')
        quantity = request.data.get('quantity', 0)

        try:
            from_prod, to_prod = InventoryService.transfer_stock(pk, to_product_id, int(quantity))
            return Response({
                'message': 'Transferência realizada com sucesso',
                'Produto de Origem': from_prod,
                'Produto de Destino': to_prod
            })
        except Exception as e:
            return Response({'error': str(e)}, status=400)


    # --- ACTIONS DE RELATÓRIO (ReportService) ---

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Resumo gerado pelo ReportService"""
        threshold = int(request.query_params.get('threshold', 10))

        # O summary agora pode retornar o relatório completo que definimos no ReportService
        data = ReportService.generate_inventory_report()
        if request is None:
            return Response(data)

        # Ou apenas o específico:
        data_filtered = data['low_stock_count'] = ReportService.check_low_stock_threshold(threshold)

        return Response(data_filtered)

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Mantém a listagem filtrada para o frontend"""
        products = self.get_queryset().filter(quantity__lt=10)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)