from django.db import models

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Task(models.Model):
    class Status(models.TextChoices):
        TODO = 'todo'
        IN_PROGRESS = 'in_progress'
        DONE = 'done'
    class Priority(models.TextChoices):
        LOW = 'low'
        MEDIUM = 'medium'
        HIGH = 'high'
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='task')
    title = models.CharField(max_length=200)
    description = models.TextField()
    due_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices)
    priority = models.CharField(max_length=20, choices=Priority.choices)

    def __str__(self):
        return self.title
