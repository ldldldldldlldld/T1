import transformers
import torch

# Указываем идентификатор модели
model_id = "meta-llama/Meta-Llama-3-8B"

# Загружаем пайплайн для генерации текста
pipeline = transformers.pipeline(
    "text-generation",
    model=model_id,
    model_kwargs={"torch_dtype": torch.bfloat16},  # Используем bfloat16 для ускорения и оптимизации памяти
    device_map="auto"  # Автоматически выбирает устройство (CPU или GPU)
)

# Генерация текста
response = pipeline("Hey how are you doing today?")

# Вывод результата
print(response)
