Coordinator : [HardiRakholiya](https://github.com/HardiRakholiya/ANN-Playground)
# ANN-Playground
- A visualization tool for artificial neural networks that enables users to learn and understand ANN through classification tasks.
- Technologies Used: React, ExpressJS, MongoDB

# Demo 
Watch the demo on YouTube : [ANN-Playground](https://www.youtube.com/watch?v=JFApp-w0xGA)

# Live Link
https://ann-playground.netlify.app/

# Run the Application
- Fronted - npm run dev
- Backend - nodemon app.js

# Configure ANN 
- *Set Batch Size:* &nbsp; Enter the desired batch size.
- *Set Learning Rate:* &nbsp; Enter the desired learning rate.
- *Select Regularization Type:* &nbsp; Choose either L1 or L2 or No regularization.
- *Set Regularization Rate:*  &nbsp;Enter the desired regularization rate.
- *Set Split Ratio:*  &nbsp;Enter the desired split ratio for training and testing data.
- *Manage Hidden Layers:* &nbsp; Add or remove hidden layers as needed.
- *Manage Neurons:* &nbsp; Increase or decrease the number of neurons in each hidden layer.
- *Select Activation Functions:* &nbsp; Choose activation functions for each hidden layer (the last layer uses softmax).
- *Select Datapoint View:*&nbsp; Train , Test or Both.


# Classification of Default DataSet
You can press the step button to perform each epoch one by one, or press the play button to run them quickly. The classification results are displayed in real-time on the graph.
Hover to view weights and biases. Red and blue links represent negative and positive weights respectively, with link width indicating the weight's value.

![Classify Deafault](https://github.com/Harshil-Ramani/ANN-Playground/assets/127288719/8c98ba53-85f9-496f-b879-74ae09f7dd3d)

![Classify Deafault Dataset](https://github.com/Harshil-Ramani/ANN-Playground/assets/127288719/7ffc8581-b424-4bb0-96dc-abe4c74e5126)

# User Registration
User can register.

![Register](https://github.com/Harshil-Ramani/ANN-Playground/assets/127288719/48994d0a-3820-4fe4-827e-ed4bd4705cd9)


# User Login
User can Login.

![login](https://github.com/Harshil-Ramani/ANN-Playground/assets/127288719/22190bfb-d59f-43c1-83d7-264abff9d300)

# Upload userDataSet
User can also upload their own dataset as a .csv file. The file should include columns labeled x1, x2, and label, and train it just like the default dataset.

![upload](https://github.com/Harshil-Ramani/ANN-Playground/assets/127288719/b7466b5d-6daa-4fba-8eab-ca8b8923dd3f)


# Logout
User can log out and log in again to retrieve their last status.
