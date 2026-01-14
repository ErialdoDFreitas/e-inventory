from django.db.models import Sum, Count, Avg
from api.models.product import Product
from api.models.category import Category

class ReportService:
    @staticmethod
    def check_low_stock_threshold(threshold=10):
        """Retorna a contagem de itens que precisam de reposição urgente"""
        return Product.objects.filter(
            quantity__lt=threshold,
            is_active=True
        ).count()

    @staticmethod
    def generate_inventory_report():
        """Gera métricas financeiras e por categoria para o Dashboard React"""
        return {
            'total_products': Product.objects.filter(is_active=True).count(),
            'inventory_value': Product.objects.filter(is_active=True).aggregate(
                val=Sum(models.F('price') * models.F('quantity'), output_field=models.DecimalField())
            )['val'] or 0,
            'low_stock_count': ReportService.check_low_stock_threshold(),
            'categories_summary': Category.objects.annotate(
                product_count=Count('products'),
                total_stock=Sum('products__quantity')
            ).values('name', 'product_count', 'total_stock')
        }