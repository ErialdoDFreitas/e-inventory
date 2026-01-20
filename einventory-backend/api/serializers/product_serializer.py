# api/serializers/product_serializer.py
from rest_framework import serializers
from api.models.product import Product
# from api.models.category import Category


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer para listagem de produtos"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'sku', 'price', 'quantity',
            'category_name', 'is_in_stock', 'is_active'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalhes do produto"""
    category = serializers.SerializerMethodField()
    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )
    is_in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'sku', 'price', 'quantity',
            'category', 'is_active', 'is_in_stock',
            'created_by_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_category(self, obj):
        """Retorna dados da categoria"""
        return {
            'id': obj.category.id,
            'name': obj.category.name
        }


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer para criar/atualizar produto"""

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'sku', 'price',
            'quantity', 'category', 'is_active'
        ]

    def validate_sku(self, value):
        """Valida SKU"""
        if not value.isalnum():
            raise serializers.ValidationError(
                "SKU deve conter apenas letras e números"
            )
        return value.upper()

    def validate_price(self, value):
        """Valida preço"""
        if value <= 0:
            raise serializers.ValidationError(
                "Preço deve ser maior que zero"
            )
        return value

    def validate_quantity(self, value):
        """Valida quantidade"""
        if value < 0:
            raise serializers.ValidationError(
                "Quantidade não pode ser negativa"
            )
        return value