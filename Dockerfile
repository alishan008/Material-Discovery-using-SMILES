FROM python:3.7.11

WORKDIR /app

ADD . /app

RUN pip3 install -r requirements.txt

EXPOSE 5000

ENV NAME MatDiscovery

CMD python app.py
