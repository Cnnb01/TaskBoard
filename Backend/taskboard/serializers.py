from rest_framework import serializers
from .models import Project, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id','project_id','title','description','due_date','status','priority','created_at']
        read_only_fields = ['created_by']

class ProjectSeriliazer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = ['id','name','description','created_at','tasks']
        read_only_fields = ['created_by']