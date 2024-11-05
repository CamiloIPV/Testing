import boto3

# Configura el cliente de Cognito
client = boto3.client('cognito-idp')

user_pool_id = 'sa-east-1_RHtYRB8h0'  # Reemplaza con tu User Pool ID
usuarios = ['johndoe1234@gmail.com', 'emily.smith987@gmail.com', 'alex.jones5678@gmail.com','samuel.green321@gmail.com','laura.brown4567@gmail.com','mike.johnson890@gmail.com','olivia.williams23@gmail.com','sarah.miller1245@gmail.com']  # Lista de correos a actualizar

for username in usuarios:
    response = client.admin_set_user_password(
        UserPoolId=user_pool_id,
        Username=username,
        Password='NuevaContraseñaSegura123!',  # Asegúrate de que cumpla con las políticas de seguridad
        Permanent=True  # Esto establece la contraseña de forma permanente y quita el "Forzar cambio de contraseña"
    )
    print(f"Usuario {username} actualizado correctamente.")
