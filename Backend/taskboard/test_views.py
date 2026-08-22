from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from taskboard.models import Project, Task


class ProjectViewTest(APITestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")