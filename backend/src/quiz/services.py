# backend/src/quiz/services.py
from users.models import UserProfile
from collections import defaultdict
import json

class QuizProcessor:
    def __init__(self, user, quiz_data):
        self.user = user
        self.quiz_data = quiz_data
        # get_or_create is robust: it finds the existing profile or creates one if it's missing.
        self.profile, _ = UserProfile.objects.get_or_create(user=self.user)

    def process_and_save(self):
        self._process_body_and_lifestyle()
        self._calculate_wardrobe_percentages()
        self._calculate_style_scores()
        self.profile.save()
        print(f"Profile for {self.user.email} has been updated successfully.")


    def _process_body_and_lifestyle(self):
        # Assumes quiz_data contains keys like 'primary_body_type', 'weekday_lifestyle', etc.
        self.profile.primary_body_type = self.quiz_data.get('primary_body_type')
        self.profile.secondary_body_type = self.quiz_data.get('secondary_body_type')
        self.profile.weekday_lifestyle = self.quiz_data.get('weekday_lifestyle')
        
        # Assuming weekend lifestyle is a list of strings in the quiz data
        weekend_styles = self.quiz_data.get('weekend_lifestyle', [])
        self.profile.weekend_lifestyle = ",".join(weekend_styles)


    def _calculate_wardrobe_percentages(self):
        # This will map the answers from the flowchart to percentages.
        # This is a placeholder; we'll need the exact question/answer format from the frontend.
        percentages = {}
        
        # Example logic based on the flowchart
        season_answer = self.quiz_data.get('seasonality_answer') # e.g., '3-months'
        if season_answer == 'always':
            percentages['winter_wear'] = 0.75
        elif season_answer == '3-months':
            percentages['winter_wear'] = 0.5
        # ... and so on for all options

        # We would repeat this for workwear, dresses, and utility
        percentages['workwear'] = 0.7 # Placeholder
        percentages['dresses'] = 0.5 # Placeholder
        percentages['statement'] = 0.3 # Placeholder

        self.profile.wardrobe_percentages = percentages


    def _calculate_style_scores(self):
        scores = defaultdict(float)
        style_selections = self.quiz_data.get('style_selections', [])
        
        for selection in style_selections:
            # Ensure the selection is a list/tuple with exactly two items
            if isinstance(selection, list) and len(selection) == 2:
                primary_style, secondary_style = selection
                if primary_style:
                    scores[primary_style] += 1.0
                if secondary_style:
                    scores[secondary_style] += 0.5

        self.profile.style_scores = dict(scores)
        
        sorted_styles = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        top_styles = [style for style, score in sorted_styles[:3]]
        
        self.profile.top_three_styles = ",".join(top_styles)