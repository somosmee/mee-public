FROM tiangolo/uwsgi-nginx-flask:python3.8

COPY ./app /app

# debug mode
ENV FLASK_APP=main.py
ENV FLASK_DEBUG=1
ENV FLASK_ENV=development

RUN pip install -r requirements.txt --src /usr/local/src

# debug mode
CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]
