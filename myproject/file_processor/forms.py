from django import forms

class ChatForm(forms.Form):
    user_message = forms.CharField(widget=forms.Textarea, required=True, label="Ваш вопрос")
