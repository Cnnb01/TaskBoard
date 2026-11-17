from rest_framework import serializers
from .models import Project, Task

class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.SerializerMethodField()
    class Meta:
        model = Task
        fields = ['id','project', 'project_name','title','description','due_date','status','priority','created_at']

    def get_project_name(self, obj):
        return obj.project.name

class ProjectSeriliazer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = ['id','name','description','created_at','tasks']