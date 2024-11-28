import httpx
from django.shortcuts import render
from langchain_openai import OpenAI
from langchain_core.prompts import PromptTemplate
from .forms import ChatForm

# Настройка httpx клиента с прокси, используя авторизацию
# http_client = httpx.Client(proxies="http://mZPdvB:cvS6Cx@85.195.81.166:11333")

# Инициализация OpenAI с прокси
llm = OpenAI(
    model="gpt-3.5-turbo-instruct",  # Модель, которую вы хотите использовать
    temperature=0.7,  # Температура для генерации текста
    max_retries=2,  # Количество попыток при ошибке
    api_key="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",  # Ваш API-ключ
    # http_client=http_client  # Передача http-клиента с прокси
)

# Шаблон для вопросов
prompt = PromptTemplate.from_template("How to say {input} in {output_language}:\n")

def process_text_with_ai(question, output_language="English"):
    """Использование LangChain и OpenAI для ответа на вопросы."""
    try:
        # Создание запроса с использованием шаблона
        chain = prompt | llm
        response = chain.invoke({
            "output_language": output_language,
            "input": question
        })
        return response.strip()  # Извлекаем и возвращаем ответ
    except Exception as e:
        return f"Ошибка: {e}"

def chat_view(request):
    ai_response = None
    if request.method == 'POST':
        form = ChatForm(request.POST)
        if form.is_valid():
            user_message = form.cleaned_data['user_message']
            # Если пользователь ввел сообщение, получаем ответ от AI
            if user_message.strip():
                ai_response = process_text_with_ai(user_message)
            else:
                ai_response = "Пожалуйста, введите текстовое сообщение."

            return render(request, 'file_processor/chat.html', {'form': form, 'ai_response': ai_response})

    else:
        form = ChatForm()

    return render(request, 'file_processor/chat.html', {'form': form, 'ai_response': ai_response})
