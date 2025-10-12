# backend/src/products/management/commands/import_products.py
import csv
from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    help = 'Import products from a CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The CSV file to import.')

    def handle(self, *args, **options):
        # We need to map CSV headers to model fields
        header_to_field_map = {
            'ID': 'item_id',
            'Item Name': 'item_name',
            'Image': 'image_url', # Assuming the URL is parsable from the string
            'Category': 'category',
            'Colour Name': 'color_name',
            'Colour Family': 'color_family',
            'Colour_is_neutral': 'is_neutral',
            'Season': 'season',
            'Fit': 'fit',
            'Style': 'style',
            'BodyType': 'body_type',
            'Lifestyle': 'lifestyle',
            'Utility': 'utility',
        }

        with open(options['csv_file'], 'r', encoding='utf-8-sig') as file:
            reader = csv.DictReader(file)
            
            # Clear existing products
            Product.objects.all().delete()
            self.stdout.write(self.style.WARNING('Deleted all existing products.'))
            
            products_to_create = []
            for row in reader:
                if not row.get('ID'): continue # Skip empty rows

                # A simple helper to parse the image URL from the CSV format
                image_full_string = row.get('Image', '')
                image_url = image_full_string.split('(')[-1].replace(')', '') if '(' in image_full_string else ''
                
                # Convert 'True'/'False' strings to boolean
                is_neutral = row.get('Colour_is_neutral', '').lower() == 'true'

                product_data = {
                    'item_id': row.get('ID'),
                    'item_name': row.get('Item Name'),
                    'image_url': image_url,
                    'category': row.get('Category'),
                    'color_name': row.get('Colour Name'),
                    'color_family': row.get('Colour Family'),
                    'is_neutral': is_neutral,
                    'season': row.get('Season'),
                    'fit': row.get('Fit'),
                    'style': row.get('Style'),
                    'body_type': row.get('BodyType'),
                    'lifestyle': row.get('Lifestyle'),
                    'utility': row.get('Utility'),
                }
                products_to_create.append(Product(**product_data))
            
            Product.objects.bulk_create(products_to_create)
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {len(products_to_create)} products.'))