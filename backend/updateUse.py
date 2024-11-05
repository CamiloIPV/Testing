import boto3

# Configura el cliente de Cognito
client = boto3.client('cognito-idp')

user_pool_id = 'sa-east-1_RHtYRB8h0'  # Reemplaza con tu User Pool ID
usuarios = ['johndoe1234@gmail.com', 'emily.smith987@gmail.com', 'alex.jones5678@gmail.com','samuel.green321@gmail.com','laura.brown4567@gmail.com','mike.johnson890@gmail.com','olivia.williams23@gmail.com','sarah.miller1245@gmail.com']  # Lista de correos a actualizar

for username in usuarios:
    response = client.admin_update_user_attributes(
        UserPoolId=user_pool_id,
        Username=username,
        UserAttributes=[
            {
                'Name': 'email_verified',
                'Value': 'true'
            }
        ]
    )
    print(f"Usuario {username} actualizado: {response}")
