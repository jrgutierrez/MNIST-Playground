from typing_extensions import final
from flask import Flask, render_template, request, jsonify
import pickle
import ast
import numpy as np
import os

os.environ['KMP_DUPLICATE_LIB_OK']='True'


model = pickle.load(open('resources/convolutional_nn_model.pkl', 'rb'))


app = Flask(__name__)
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route("/predict", methods=['GET','POST'])
def predict():
    if request.method == 'POST': 
        draw = request.get_json() 

        if draw == None:
            draw = [[[0]*28]*28]
            draw = str(draw)

        draw = np.array(ast.literal_eval(draw))
        draw = draw.reshape(1,1,28,28)

        if np.all(draw == 0):
            prediction = ''
            dic = {}
            for i in range(10):
                dic[f'{i}'] = ''
            dic['pred_text'] = ''
            dic['prob_text'] = ''
            
        else:
            print(draw)
            prediction = model.predict_classes(draw)[0]
            pred_probs = model.predict_proba(draw)
            ordered_idsx = np.argsort(pred_probs[0])[::-1]
            probs = []
            for i in range(10):
                probs.append(f'{ordered_idsx[i]}: {np.trunc(pred_probs[0][ordered_idsx[i]]*1000000)/1000000}')
            dic = {}
            for i in range(10):
                dic[f'{i}'] = f'{probs[i]}'
            dic['pred_text'] = 'Prediction:'
            dic['prob_text'] = 'Probabilities:'

        dic['prediction'] = f'{prediction}'

        return jsonify(dic)
        
    if request.method == 'GET': 
        return render_template('layout.html')
    
if __name__ == '__main__':
    app.run(debug=True)