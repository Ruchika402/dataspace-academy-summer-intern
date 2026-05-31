from django.apps import apps
from django.test import TestCase


class CustomerAppTests(TestCase):
	def test_customer_app_is_installed(self):
		self.assertTrue(apps.is_installed('customer'))
