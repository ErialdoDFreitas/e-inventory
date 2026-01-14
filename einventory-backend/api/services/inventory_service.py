from django.db import transaction, models
from django.core.exceptions import ValidationError
from api.models.product import Product


class InventoryService:
    @staticmethod
    def bulk_update_prices(category_id, percentage):
        """Atualiza preços em massa via banco de dados (Alta Performance)"""
        multiplier = 1 + (percentage / 100)
        return Product.objects.filter(
                category_id=category_id,
                is_active=True
            ).update(price=models.F('price') * multiplier)

    @staticmethod
    def transfer_stock(from_product_id, to_product_id, quantity):
        """Transfere estoque entre produtos com trava de segurança (Select for Update)"""
        with transaction.atomic():
            from_product = Product.objects.select_for_update().get(id=from_product_id)
            to_product = Product.objects.select_for_update().get(id=to_product_id)

            if from_product.quantity < quantity:
                raise ValidationError("Estoque insuficiente no produto de origem")

            from_product.quantity -= quantity
            to_product.quantity += quantity

            from_product.save()
            to_product.save()
            return from_product, to_product