from django.test import TestCase
from taskboard.serializers import ProjectSeriliazer, TaskSerializer
from taskboard.models import Project, Task
from django.utils import timezone

# serializer.is_valid() returns True/False
# {**self.valid_data, 'status': 'invalid'} creates a copy of valid data with just one field changed — cleaner than rewriting the whole dict each time



class ProjectSerializerTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")

    def test_contains_expected_fields(self):
        serializer = ProjectSeriliazer(self.project)
        expected_fields = ['id', 'name', 'description', 'created_at', 'tasks']
        # set(serializer.data.keys())- extracts all field names present in the serialized output and converts them into an unordered collection of unique elements
        self.assertEqual(set(serializer.data.keys()), set(expected_fields))

    def test_valid_data(self):
        valid_data = {'name': 'New Project'}
        serializer = ProjectSeriliazer(data=valid_data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_data(self):
        invalid_data = {'description': 'No name provided'}
        serializer = ProjectSeriliazer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)


    def test_tasks_is_nested(self):
        Task.objects.create(project=self.project, title="Task 1", due_date=timezone.now(), status='todo', priority='low')
        serializer = ProjectSeriliazer(self.project)
        self.assertEqual(len(serializer.data['tasks']), 1)

class TaskSerializerTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(name="Test Project")
        self.valid_data = {
            'project' : self.project.id,
            'title': 'Test Task',
            'description': 'This is a test task',
            'due_date': timezone.now(),
            'status': 'todo',
            'priority': 'low'
        }

    def test_contains_expected_fields(self):
        task = Task.objects.create(
            project=self.project,
            title=self.valid_data['title'],
            description=self.valid_data['description'],
            due_date=self.valid_data['due_date'],
            status=self.valid_data['status'],
            priority=self.valid_data['priority']
        )
        serializer = TaskSerializer(task)
        expected_fields = ['id', 'project', 'title', 'description', 'due_date', 'status', 'priority', 'created_at']
        self.assertEqual(set(serializer.data.keys()), set(expected_fields))

    def test_valid_data(self):
        serializer = TaskSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())

    def test_invalid_status(self):
        data = {**self.valid_data, 'status': 'invalid'}
        serializer = TaskSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('status', serializer.errors)

    def test_invalid_priority(self):
        data = {**self.valid_data, 'priority': 'invalid'}
        serializer = TaskSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('priority', serializer.errors)

    def test_title_is_required(self):
        data = {**self.valid_data}
        data.pop('title')
        serializer = TaskSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)