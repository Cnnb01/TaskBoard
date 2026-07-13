from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Project, Task
from .serializers import TaskSerializer, ProjectSeriliazer
from django.shortcuts import get_object_or_404
# Create your views here.

@api_view(['GET','POST',])
def project_list(request):
    if request.method == 'GET': 
        projects = Project.objects.all()
        serializer = ProjectSeriliazer(projects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = ProjectSeriliazer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','PATCH','DELETE'])  
def project_details(request, pk):
    if request.method == 'GET':
        # project = Project.objects.get(pk=pk)
        project = get_object_or_404(Project, pk=pk)
        serializer = ProjectSeriliazer(project)
        print("the project returned is=>",serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'PUT' or request.method == 'PATCH':
        # project = Project.objects.get(pk=pk)
        project = get_object_or_404(Project, pk=pk)
        serializer = ProjectSeriliazer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        # project = Project.objects.get(pk=pk)
        project = get_object_or_404(Project, pk=pk)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST'])
def tasks_list(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        status_filter = request.query_params.get('status')
        priority = request.query_params.get('priority')
        project = request.query_params.get('project')
        if status_filter:
            tasks = tasks.filter(status=status_filter)
        if priority:
            tasks = tasks.filter(priority=priority)
        if project:
            tasks = tasks.filter(project=project)
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 
@api_view(['GET','PUT', 'PATCH', 'DELETE'])
def manage_tasks(request,pk):
    if request.method == 'GET':
        # task = Task.objects.get(pk=pk)
        task = get_object_or_404(Task, pk=pk)
        serializer = TaskSerializer(task)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'PUT' or request.method == 'PATCH':
        # task = Task.objects.get(pk=pk)
        task = get_object_or_404(Task, pk=pk)
        serializer = TaskSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        # task = Task.objects.get(pk=pk)
        task = get_object_or_404(Task, pk=pk)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)