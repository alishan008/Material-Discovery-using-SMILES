from flask import Flask, request, render_template
from rdkit import Chem
from rdkit.Chem import Descriptors
import numpy as np
import pandas as pd
from joblib import load

#scaler = load('scaler.joblib')
ml_model = load('ml_model.joblib')

app = Flask(__name__)

@app.route('/')
@app.route('/home')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    if request.method == 'POST':
        try:
            reg = str(request.form['text'])
            smiles = [line for line in reg.split('\n') if line.strip() != '']

            baseData= np.arange(1,1)
            i=0 
            for elem in smiles:
                mol=Chem.MolFromSmiles(elem)  
                desc_MolLogP = Descriptors.MolLogP(mol)
                desc_MolWt = Descriptors.MolWt(mol)
                desc_NumRotatableBonds = Descriptors.NumRotatableBonds(mol)
                heavy_atom_count = Descriptors.HeavyAtomCount(mol)
                
                row = np.array([desc_MolLogP,
                                desc_MolWt,
                                desc_NumRotatableBonds,
                                heavy_atom_count])   
            
                if(i==0):
                    baseData=row
                else:
                    baseData=np.vstack([baseData, row])
                i=i+1
            columnNames=["desc_MolLogP","desc_MolWt","NumRotatableBonds","heavy_atom_count"]   
            descriptors = pd.DataFrame(data=baseData,columns=columnNames)

            #descriptors = scaler.transform(descriptors)
            predictions = ml_model.predict(descriptors)
            predictions = np.round_(predictions)
            predictions = np.where(predictions > 0, "Accept", "Reject")

            final_dict = dict(zip(smiles, predictions))
            result = final_dict
        except ValueError:
            return "Please check if the values are entered correctly"
    return render_template('table.html', result=result)

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)
