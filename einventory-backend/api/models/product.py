# api/models/product.py
from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    """Model de Produto"""
    name = models.CharField(max_length=200, verbose_name="Nome")
    description = models.TextField(verbose_name="Descrição")
    sku = models.CharField(max_length=50, unique=True, verbose_name="SKU")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Preço")
    quantity = models.IntegerField(default=0, verbose_name="Quantidade")
    category = models.ForeignKey(
        'Category',
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name="Categoria"
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Criado por"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        db_table = 'products'

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def is_in_stock(self):
        """Verifica se está em estoque"""
        return self.quantity > 0