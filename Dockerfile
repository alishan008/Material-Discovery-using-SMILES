FROM python:3.7.11

ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"
RUN apt-get update

RUN apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ADD . /app/



RUN python -m pip install --upgrade pip
RUN conda install -c rdkit rdkit -y
RUN pip3 install --no-cache-dir -r  /app/requirements.txt

EXPOSE 5000

ENV NAME MatDiscovery

CMD python app.py
