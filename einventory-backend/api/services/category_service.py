from django.core.exceptions import ValidationError
from api.models.category import Category


class CategoryService:
    @staticmethod
    def create_category(data):
        """Cria categoria com validações de negócio customizadas"""
        # Exemplo: impedir nomes de categorias muito curtos
        if len(data.get('name', '')) < 3:
            raise ValidationError({"name": "Nome da categoria muito curto."})

        return Category.objects.create(**data)

    @staticmethod
    def safe_delete(category_id):
        """
        Executa uma deleção lógica (is_active=False), mas verifica
        se existem produtos ativos vinculados antes de permitir.
        """
        category = Category.objects.get(id=category_id)

        # Regra de negócio: Não desativar categoria com produtos em estoque
        has_stock = category.products.filter(is_active=True, quantity__gt=0).exists()

        if has_stock:
            raise ValidationError(
                "Não é possível desativar uma categoria que possui produtos com estoque positivo."
            )

        category.is_active = False
        category.save()
        return category