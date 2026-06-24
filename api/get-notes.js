export default async function handler(req, res) {

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;

  try {

    const r = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/notes.json`,
      {
        headers:{
          Authorization:`token ${token}`
        }
      }
    );

    const file = await r.json();

    const data = JSON.parse(
      Buffer.from(file.content,"base64").toString()
    );

    res.status(200).json(data);

  } catch(err){

    res.status(500).json({
      error:err.message
    });

  }

}
