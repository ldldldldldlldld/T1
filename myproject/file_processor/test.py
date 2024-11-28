import getpass
import os

os.environ["NGC_API_KEY"] = "bnFmY3RxdnZmaHZkaTlhYTgzMmFzazU1ZXA6YmZiYzQyODctMzRmMS00MTJlLWI0ZjEtZWQ5YmNhZmMwMzk2"

from langchain_nvidia_ai_endpoints import ChatNVIDIA

model = ChatNVIDIA(model="meta/llama3-70b-instruct")

from langchain_core.messages import HumanMessage, SystemMessage

messages = [
    SystemMessage("Translate the following from English into Italian"),
    HumanMessage("hi!"),
]

model.invoke(messages)

model.invoke("Hello")

model.invoke([{"role": "user", "content": "Hello"}])

model.invoke([HumanMessage("Hello")])

for token in model.stream(messages):
    print(token.content, end="|")

    from langchain_core.prompts import ChatPromptTemplate

    system_template = "Translate the following from English into {language}"

    prompt_template = ChatPromptTemplate.from_messages(
        [("system", system_template), ("user", "{text}")]
    )

prompt = prompt_template.invoke({"language": "Italian", "text": "hi!"})

prompt
prompt.to_messages()


response = model.invoke(prompt)
print(response.content)