FROM python:3.7.11

WORKDIR /app

ADD . /app/

RUN python -m pip install --upgrade pip
RUN pip3 install --no-cache-dir -r  /app/requirements.txt

EXPOSE 5000

ENV NAME MatDiscovery

CMD python app.py
