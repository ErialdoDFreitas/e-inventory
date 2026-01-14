from django.core.exceptions import ValidationError
from api.models.product import Product


class ProductService:
    @staticmethod
    def create_product(data, user):
        """Cria produto com lógica de negócio extra"""
        # Validação manual (caso não queira confiar apenas no Serializer)
        if Product.objects.filter(sku=data.get('sku')).exists():
            raise ValidationError({"sku": "Este SKU já está em uso."})

        product = Product.objects.create(
            **data,
            created_by=user
        )

        # Exemplo de lógicas adicionais futuras:
        # EmailService.send_admin_alert(f"Novo produto: {product.name}")
        # NotificationService.notify_new_product(product)

        return product