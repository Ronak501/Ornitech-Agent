# backend/test_search.py
from app.db import collection
from rag.search import search
from embeddings.embed import embed

print(f"Total documents in database: {collection.count_documents({})}")

test_question = "What is Ornitech?"
vector = embed(test_question)
if vector:
    print(f"Embedding successful. Vector size: {len(vector)}")
else:
    print("Embedding failed!")

results = search(test_question)
print(f"Vector search returned {len(results)} results.")

# Let's verify the indexes
print("\n--- Index Diagnosis ---")
try:
    indexes = list(collection.list_search_indexes())
    if not indexes:
        print("No search indexes found! Did you create it on the exact database 'Ornitech' and collection 'knowledge_base'?")
    else:
        for idx in indexes:
            print(f"Index Name: {idx.get('name')}")
            print(f"Status: {idx.get('status')}")
            print(f"Type: {idx.get('type')}")
            print(f"Latest Definition: {idx.get('latestDefinition')}")
            print("----------------")
except Exception as e:
    print(f"Could not list indexes: {e}")
