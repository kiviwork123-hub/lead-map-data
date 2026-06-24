export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const noteData = req.body;

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;

    const path = "notes.json";

    const githubUrl =
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

    // đọc file hiện tại

    const current = await fetch(githubUrl,{
      headers:{
        Authorization:`token ${token}`
      }
    });

    let notes = [];
    let sha = null;

    if(current.ok){

      const file = await current.json();

      sha = file.sha;

      notes = JSON.parse(
        Buffer.from(file.content,"base64")
        .toString()
      );

    }

    notes.push({
      ...noteData,
      createdAt:new Date().toISOString()
    });

    const content = Buffer
      .from(JSON.stringify(notes,null,2))
      .toString("base64");

    const update = await fetch(githubUrl,{
      method:"PUT",
      headers:{
        Authorization:`token ${token}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message:"Add lead note",
        content,
        sha
      })
    });

    const result = await update.json();

    return res.status(200).json({
      success:true,
      result
    });

  } catch(err){

    return res.status(500).json({
      error:err.message
    });

  }

}
