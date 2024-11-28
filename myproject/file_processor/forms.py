from django import forms

class ChatForm(forms.Form):
    model_choice = forms.ChoiceField(
        choices=[
            ('openai', 'OpenAI'),
            ('distilbert', 'DistilBERT'),
            ('bloom', 'Bloom'),
        ],
        label="Выберите модель",
        required=True
    )
    user_message = forms.CharField(label="Сообщение", required=False, widget=forms.Textarea)
