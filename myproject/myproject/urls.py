# myproject/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('file_processor/', include('file_processor.urls')),  # Подключаем приложение file_processor
]
