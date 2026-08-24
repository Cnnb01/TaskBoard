from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from taskboard.models import Project, Task

#APITestCase gives you self.client which can make HTTP requests (get, post, put, delete)
#res
#├── status_code→200
#├── data→{ "count": 1, "next": null, "previous": null, "results": [...] }
#    {
#    "count": 1,
#    "next": null,
#    "previous": null,
#    "results": [
#        {
#            "id": 1,
#            "name": "Test Project",
#            "description": "Test Desc",
#            "created_at": "2026-07-23T11:35:12.738597Z",
#            "tasks": []
#        }
#    ]
#}
#├── headers→{ "Content-Type": "application/json", ... }
#└── wsgi_request→the original request object


class ProjectViewTest(APITestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project", description="This is a test project")
    def test_get_projects_returns_200(self):
        res = self.client.get('/api/v1/projects/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_projects_returns_list(self):
        res = self.client.get('/api/v1/projects/')
        self.assertEqual(len(res.data['results']), 1)

    def test_create_project_returns_201(self):
        res = self.client.post('/api/v1/projects/', {'name': 'New Project', 'description': 'New Desc'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_project_invalid_data_returns_400(self):
        res = self.client.post('/api/v1/projects/', {})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_project_details_returns_200(self):
        res = self.client.get(f'/api/v1/projects/{self.project.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_nonexistent_project_returns_404(self):
        res = self.client.get('/api/v1/projects/999/')
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_project_returns_200(self):
        res = self.client.put(f'/api/v1/projects/{self.project.id}/', {'name': 'Updated Project', 'description': 'Updated Desc'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_delete_project_returns_204(self):
        res = self.client.delete(f'/api/v1/projects/{self.project.id}/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

class TaskViewTest(APITestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")
        self.task = Task.objects.create(
            project=self.project,
            title="Test Task",
            description="This is a test task",
            due_date=timezone.now(),
            status='todo',
            priority='low'
        )