import useSWR from "swr";

async function fetchApi(key) {
  const response = await fetch(key);
  return await response.json();
}

function StatusData({ isLoading, data }) {
  if (isLoading && !data) return "Carregando...";

  return (
    <div>
      <h2>Database</h2>
      <ul>
        <li>Versão: {data.dependencies.database.version}</li>
        <li>
          Conexões Abertas: {data.dependencies.database.opened_connections}
        </li>
        <li>Conexões máximas: {data.dependencies.database.max_connections}</li>
      </ul>
    </div>
  );
}

function UpdatedAt({ isLoading, data }) {
  let UpdatedAtText = "Carregando...";

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  }

  return (
    <div>
      <p>Última atualização: {UpdatedAtText}</p>
    </div>
  );
}

export default function StatusPage() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  return (
    <>
      <h1>Status</h1>
      <UpdatedAt data={data} isLoading={isLoading} />
      <StatusData data={data} isLoading={isLoading} />
    </>
  );
}
