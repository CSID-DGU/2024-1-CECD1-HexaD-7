# check/llm_utils.py
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import HuggingFaceTransformers

model_id = 'MLP-KTLim/llama-3-Korean-Bllossom-8B'

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto",
)
model.eval()

llm = HuggingFaceTransformers(model=model, tokenizer=tokenizer)

prompt_template = PromptTemplate(
    input_variables=["article_title", "article_content"],
    template="Provide feedback on the following article:\n\nTitle: {article_title}\nContent: {article_content}\n"
)

feedback_chain = LLMChain(llm=llm, prompt=prompt_template)

def generate_feedback(article_title, article_content):
    feedback = feedback_chain.run({
        "article_title": article_title,
        "article_content": article_content
    })
    return feedback
