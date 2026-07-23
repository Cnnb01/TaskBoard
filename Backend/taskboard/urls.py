from django.urls import path
from . import views

urlpatterns = [
    path('projects/', views.project_list, name='project-list'),
    path('projects/<int:pk>/', views.project_details, name='project-details'),
    path('tasks/', views.tasks_list, name='tasks_list'),
    path('tasks/<int:pk>/', views.manage_tasks, name='manage-tasks'),
    path('projects/<int:pk>/summary/', views.project_summary, name='project-summary'),
]