from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from taskboard.models import Project, Task


class ProjectViewTest(APITestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")
    def test_get_projects_returns_200(self):
        res = self.client.get('/api/v1/projects/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_projects_returns_list(self):
        res = self.client.get('/api/v1/projects/')
        self.assertEqual(len(res.data['results']), 1)