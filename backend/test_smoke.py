import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

import django
from django.apps import apps
from django.test import SimpleTestCase


django.setup()


class SmokeTests(SimpleTestCase):
    def test_customer_app_is_installed(self):
        self.assertTrue(apps.is_installed('customer'))
