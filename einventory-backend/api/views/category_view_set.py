from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError

from api.models.category import Category
from api.serializers.category_serializer import CategorySerializer
from api.services.category_service import CategoryService

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    # permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            CategoryService.create_category(serializer.validated_data)
        except DjangoValidationError as e:
            raise DRFValidationError(e.message_dict)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            CategoryService.safe_delete(instance.id)
            return Response(
                {'message': 'Categoria desativada com sucesso'},
                status=status.HTTP_204_NO_CONTENT
            )
        except DjangoValidationError as e:
            return Response({'error': str(e.message)}, status=status.HTTP_400_BAD_REQUEST)