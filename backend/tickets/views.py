import os
from openai import OpenAI
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Avg
from django.db.models.functions import TruncDate
from .models import Ticket
from .serializers import TicketSerializer
from django.conf import settings


class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'priority', 'status']
    search_fields = ['title', 'description']

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status="open").count()

        priority_data = (
            Ticket.objects.values("priority")
            .annotate(count=Count("id"))
        )

        priority_breakdown = {
            item["priority"]: item["count"]
            for item in priority_data
        }

        category_data = (
            Ticket.objects.values("category")
            .annotate(count=Count("id"))
        )

        category_breakdown = {
            item["category"]: item["count"]
            for item in category_data
        }

        daily_counts = (
            Ticket.objects
            .annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(count=Count("id"))
        )

        avg_per_day = daily_counts.aggregate(avg=Avg("count"))["avg"] or 0

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_per_day, 2),
            "priority_breakdown": priority_breakdown,
            "category_breakdown": category_breakdown,
        })

    @action(detail=False, methods=['post'], url_path='classify')
    def classify(self, request):
        description = request.data.get("description")

        if not description:
            return Response(
                {"error": "Description is required"},
                status=400
            )

        try:
            client = OpenAI(api_key=settings.OPENAI_API_KEY)

            prompt = f"""
                        You are a support ticket classifier.

                        Given the ticket description below, return ONLY valid JSON with:
                        - suggested_category (billing, technical, account, general)
                        - suggested_priority (low, medium, high, critical)

                        Do not include explanations.

                        Description:
                        \"\"\"{description}\"\"\"
                        """

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )

            content = response.choices[0].message.content

            import json
            parsed = json.loads(content)

            return Response({
                "suggested_category": parsed.get("suggested_category"),
                "suggested_priority": parsed.get("suggested_priority")
            })

        except Exception as e:
            print("LLM ERROR:", str(e))

            return Response({
                "suggested_category": None,
                "suggested_priority": None,
                "llm_error": "LLM service unavailable"
            })