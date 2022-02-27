FROM python:3.7.11

ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"
RUN apt-get update

RUN apt-get install -y wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ADD . /app/

RUN wget \
    https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh \
    && mkdir /root/.conda \
    && bash Miniconda3-latest-Linux-x86_64.sh -b \
    && rm -f Miniconda3-latest-Linux-x86_64.sh 

RUN python -m pip install --upgrade pip
RUN pip3 install Flask==2.0.2
RUN pip3 install --no-cache-dir -r  /app/requirements.txt
RUN conda install python=3.7
RUN conda install -c rdkit rdkit -y

EXPOSE 5000

ENV NAME MatDiscovery

CMD python app.py
