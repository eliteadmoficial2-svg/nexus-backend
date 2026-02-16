import asyncio
import aiohttp
import time
import random

BASE_URL = "http://localhost:3000"
# Note: You would need a valid JWT token for a real test. 
# For this simulated environment, we assume the backend is reachable.
TOKEN = "YOUR_TEST_JWT_TOKEN" 

async def send_purchase(session, user_id):
    payload = {"amount": random.uniform(10, 100)}
    headers = {"Authorization": f"Bearer {TOKEN}"}
    try:
        async with session.post(f"{BASE_URL}/economy/buy", json=payload, headers=headers) as response:
            status = response.status
            return status
    except Exception as e:
        return str(e)

async def stress_test():
    print(f"Iniciando teste de estresse em {BASE_URL}...")
    start_time = time.time()
    
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(100):
            tasks.append(send_purchase(session, f"test_user_{i}"))
        
        results = await asyncio.gather(*tasks)
    
    end_time = time.time()
    duration = end_time - start_time
    
    success_count = sum(1 for r in results if r == 201 or r == 200)
    error_count = len(results) - success_count
    
    print(f"\n--- Resultado do Teste ---")
    print(f"Total de requisições: {len(results)}")
    print(f"Sucesso: {success_count}")
    print(f"Erros: {error_count}")
    print(f"Duração total: {duration:.2f} segundos")
    print(f"Média: {len(results)/duration:.2f} req/s")

if __name__ == "__main__":
    # check if aiohttp is installed before running if this was a real env
    asyncio.run(stress_test())
