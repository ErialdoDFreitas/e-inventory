from django.contrib import admin
from django.apps import apps
from django.db import models

# # Pega todos os modelos configurados no app 'api'
# app_models = apps.get_app_config('api').get_models()
#
# for model in app_models:
#     try:
#         # Registra o modelo. Se ele já foi registrado manualmente antes, o Django ignora o erro.
#         admin.site.register(model)
#     except admin.sites.AlreadyRegistered:
#         pass


# 1. Classe "mestre" que descobre os campos do modelo
class ListAdminMixin(admin.ModelAdmin):
    def __init__(self, model, admin_site):
        # Pega todos os nomes de campos do banco de dados desse modelo
        self.list_display = [field.name for field in model._meta.fields]

        # Opcional: Adiciona links de clique no nome e no ID
        self.list_display_links = [self.list_display[0], self.list_display[1]]

        # Opcional: Adiciona filtros laterais para campos booleanos ou chaves estrangeiras
        self.list_filter = [field.name for field in model._meta.fields if
                            field.is_relation or isinstance(field, (models.BooleanField, models.DateTimeField))]

        super().__init__(model, admin_site)


# 2. Autodiscover usando essa classe
app_models = apps.get_app_config('api').get_models()

for model in app_models:
    try:
        # Passamos a nossa classe visual como segundo argumento
        admin.site.register(model, ListAdminMixin)
    except admin.sites.AlreadyRegistered:
        pass