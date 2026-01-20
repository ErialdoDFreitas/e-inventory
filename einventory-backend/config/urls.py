"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from api.views.category_view_set import CategoryViewSet
from api.views.product_view_set import ProductViewSet

# Router for ViewSets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Swagger UI:
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# URLs geradas automaticamente:
# GET    /api/products/                        → list
# POST   /api/products/                        → create
# GET    /api/products/{id}/                   → retrieve
# PUT    /api/products/{id}/                   → update
# PATCH  /api/products/{id}/                   → partial_update
# DELETE /api/products/{id}/                   → destroy
# POST   /api/products/{id}/reduce_stock/      → custom action
# GET    /api/products/low_stock/              → custom action
# GET    /api/products/out_of_stock/           → custom action
# POST   /api/products/bulk_update_prices/     → custom action