# backend/src/products/documents.py
from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Product

@registry.register_document
class ProductDocument(Document):
    # This defines how a text field is analyzed. 'keyword' is good for exact matches (tags).
    style = fields.TextField(
        attr='style',
        fields={'raw': fields.KeywordField()}
    )
    body_type = fields.TextField(
        attr='body_type',
        fields={'raw': fields.KeywordField()}
    )
    lifestyle = fields.TextField(
        attr='lifestyle',
        fields={'raw': fields.KeywordField()}
    )

    class Index:
        # name of the Elasticsearch index
        name = 'products'
        # see Elasticsearch Indices API reference for available settings
        settings = {'number_of_shards': 1,
                    'number_of_replicas': 0}

    class Django:
        model = Product # the model associated with this document

        # the fields of the model we want to be indexed in Elasticsearch
        fields = [
            'item_id',
            'item_name',
            'category',
            'is_neutral',
            'season',
            'fit',
            'utility',
        ]