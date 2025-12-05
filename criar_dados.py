import requests
import json
import sys

API_URL = "http://localhost:8080/api"

def create_driver():
    print("🚗 Criando Motorista...")
    data = {
        "nome": "Carlos Mendes",
        "email": "carlos.mendes@motorista.com",
        "cpf": "98765432100",
        "telefone": "(85) 98888-7777",
        "senha": "senha123",
        "cnh": "12345678901",
        "categoriaCnh": "B",
        "ear": True
    }
    try:
        response = requests.post(f"{API_URL}/autonomos", json=data)
        if response.status_code == 201 or response.status_code == 200:
            user = response.json()
            print(f"  ✅ Motorista: {user['nome']} (ID: {user['id']})")
            return user['id']
        else:
            # Try finding existing
            response = requests.get(f"{API_URL}/usuarios")
            users = response.json()
            for u in users:
                if 'carlos.mendes' in u.get('email', '').lower():
                    print(f"  ✅ Motorista encontrado: {u['nome']} (ID: {u['id']})")
                    return u['id']
            print(f"  ❌ Erro ao criar motorista: {response.text}")
            return None
    except Exception as e:
        print(f"  ❌ Erro de conexão: {e}")
        return None

def create_passengers():
    print("\n📚 Criando 10 Passageiros...")
    passengers_data = [
        {"nome":"Ana Silva","email":"ana.silva@estudante.com","cpf":"11111111111","telefone":"(85) 98888-0001","senha":"senha123","endereco":"Av. Washington Soares, 1321, Edson Queiroz, Fortaleza - CE","latitude":-3.7505,"longitude":-38.4889},
        {"nome":"Bruno Costa","email":"bruno.costa@estudante.com","cpf":"22222222222","telefone":"(85) 98888-0002","senha":"senha123","endereco":"Av. Beira Mar, 2380, Meireles, Fortaleza - CE","latitude":-3.7231,"longitude":-38.5247},
        {"nome":"Carla Santos","email":"carla.santos@estudante.com","cpf":"33333333333","telefone":"(85) 98888-0003","senha":"senha123","endereco":"Rua Major Facundo, 500, Centro, Fortaleza - CE","latitude":-3.7305,"longitude":-38.5264},
        {"nome":"Diego Oliveira","email":"diego.oliveira@estudante.com","cpf":"44444444444","telefone":"(85) 98888-0004","senha":"senha123","endereco":"Av. da Universidade, 2853, Benfica, Fortaleza - CE","latitude":-3.7474,"longitude":-38.5747},
        {"nome":"Eduarda Lima","email":"eduarda.lima@estudante.com","cpf":"55555555555","telefone":"(85) 98888-0005","senha":"senha123","endereco":"Av. João Pessoa, 2000, Parangaba, Fortaleza - CE","latitude":-3.7890,"longitude":-38.5600},
        {"nome":"Felipe Alves","email":"felipe.alves@estudante.com","cpf":"66666666666","telefone":"(85) 98888-0006","senha":"senha123","endereco":"Rua Dom Luís, 221, Montese, Fortaleza - CE","latitude":-3.7600,"longitude":-38.5500},
        {"nome":"Gabriela Rocha","email":"gabriela.rocha@estudante.com","cpf":"77777777777","telefone":"(85) 98888-0007","senha":"senha123","endereco":"Av. Eng. Santana Júnior, 2000, Cocó, Fortaleza - CE","latitude":-3.7400,"longitude":-38.4700},
        {"nome":"Henrique Ferreira","email":"henrique.ferreira@estudante.com","cpf":"88888888888","telefone":"(85) 98888-0008","senha":"senha123","endereco":"Av. Eng. Luís Vieira, 1000, Papicu, Fortaleza - CE","latitude":-3.7300,"longitude":-38.4800},
        {"nome":"Isabela Martins","email":"isabela.martins@estudante.com","cpf":"99999999999","telefone":"(85) 98888-0009","senha":"senha123","endereco":"Av. Senador Virgílio Távora, 1500, Cidade dos Funcionários, Fortaleza - CE","latitude":-3.7800,"longitude":-38.4900},
        {"nome":"João Pedro Souza","email":"joao.pedro@estudante.com","cpf":"10101010101","telefone":"(85) 98888-0010","senha":"senha123","endereco":"Rua Barão do Rio Branco, 1000, Fátima, Fortaleza - CE","latitude":-3.7200,"longitude":-38.5400}
    ]
    ids = []
    for i, p in enumerate(passengers_data):
        try:
            response = requests.post(f"{API_URL}/clientes", json=p)
            if response.status_code in [200, 201]:
                uid = response.json()['id']
                print(f"  ✅ Cliente {i+1}: {p['nome']} (ID: {uid})")
                ids.append(uid)
            else:
                # Try find existing
                response = requests.get(f"{API_URL}/usuarios")
                users = response.json()
                found = False
                for u in users:
                    if u.get('email') == p['email'] and u.get('tipo') == 'CLIENTE':
                        print(f"  ✅ Cliente {i+1} encontrado: {u['nome']} (ID: {u['id']})")
                        ids.append(u['id'])
                        found = True
                        break
                if not found:
                    print(f"  ❌ Erro cliente {i+1}: {response.text}")
        except Exception as e:
            print(f"  ❌ Erro cliente {i+1}: {e}")
    return ids

def create_post(driver_id):
    print("\n📝 Criando postagem...")
    data = {
        'autorId': driver_id,
        'titulo': 'Transporte Universitário - Rotas Flexíveis',
        'regiao': 'Fortaleza e Região Metropolitana',
        'descricao': 'Transporte confiável para todas as universidades de Fortaleza.',
        'preco': 18.00
    }
    try:
        response = requests.post(f"{API_URL}/postagens", json=data)
        if response.status_code in [200, 201]:
            post = response.json()
            print(f"  ✅ Postagem criada: {post['titulo']} (ID: {post['id']})")
            return post['id']
        else:
            print(f"  ❌ Erro postagem: {response.text}")
            return None
    except Exception as e:
        print(f"  ❌ Erro postagem: {e}")
        return None

def create_trip(post_id):
    print("\n🚌 Criando viagem...")
    data = {
        "postagemId": post_id,
        "horarioPartida": "06:30",
        "destino": "Universidade Federal do Ceará - Campus do Pici",
        "cepPartida": "60020-181",
        "enderecoPartida": "Av. da Universidade, 2853, Benfica, Fortaleza - CE",
        "latitudePartida": -3.7474,
        "longitudePartida": -38.5747,
        "capacidade": 20,
        "status": "ABERTA"
    }
    try:
        response = requests.post(f"{API_URL}/viagens", json=data)
        if response.status_code in [200, 201]:
            trip = response.json()
            print(f"  ✅ Viagem criada: {trip['destino']} (ID: {trip['id']})")
            return trip['id']
        else:
            print(f"  ❌ Erro viagem: {response.text}")
            return None
    except Exception as e:
        print(f"  ❌ Erro viagem: {e}")
        return None

def enroll_passengers(trip_id, passenger_ids):
    print("\n🎫 Inscrevendo passageiros...")
    for pid in passenger_ids:
        data = {"viagemId": trip_id, "clienteId": pid}
        try:
            requests.post(f"{API_URL}/inscricoes", json=data)
            print(f"  ✅ Passageiro {pid} inscrito.")
        except:
            pass

def main():
    driver_id = create_driver()
    if not driver_id: return
    
    passenger_ids = create_passengers()
    
    post_id = create_post(driver_id)
    if not post_id: return
    
    trip_id = create_trip(post_id)
    if not trip_id: return
    
    enroll_passengers(trip_id, passenger_ids)
    print("\n🎉 Dados criados com sucesso!")

if __name__ == "__main__":
    main()

