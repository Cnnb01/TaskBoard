from django.test import TestCase
from taskboard.models import Project, Task
from django.utils import timezone

# self.assertEqual(a, b) — checks a == b
# self.assertIsNone(x) — checks x is None
# self.assertIsNotNone(x) — checks x is not None
# setUp — runs before every single test method, good for creating shared objects like self.project

class ProjectModelTest(TestCase):
    def test_project_creation(self):
        project = Project.objects.create(name="My Project")
        self.assertEqual(project.name, "My Project")

    def test_description_can_be_blank(self):
        project = Project.objects.create(name="No description")
        self.assertIsNone(project.description)

    def test_created_at_is_set(self):
        project = Project.objects.create(name="Check created_at")
        self.assertIsNotNone(project.created_at)

    def test_str_returns_name(self):
        project = Project.objects.create(name="My Project")
        self.assertEqual(str(project), "My Project")

class TaskModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")

    def test_task_creation(self):
        task = Task.objects.create(
            project=self.project,
            title="My Task",
            due_date=timezone.now(),
            status=Task.Status.TODO,
            priority=Task.Priority.MEDIUM
        )
        self.assertEqual(task.title, "My Task")
        self.assertEqual(task.status, Task.Status.TODO)
        self.assertEqual(task.priority, Task.Priority.MEDIUM)

    def test_str_returns_title(self):
        task = Task.objects.create(
            project=self.project,
            title="My Task",
            due_date=timezone.now(),
            status=Task.Status.TODO,
            priority=Task.Priority.MEDIUM
        )
        self.assertEqual(str(task), "My Task")

    def test_task_deleted_when_project_deleted(self):
        Task.objects.create(
            project=self.project,
            title="My Task",
            due_date=timezone.now(),
            status=Task.Status.TODO,
            priority=Task.Priority.MEDIUM
        )
        self.project.delete()
        self.assertEqual(Task.objects.count(), 0)
    