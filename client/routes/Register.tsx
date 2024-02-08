import React from "react";

export async function action({
  request,
  params,
}: {
  request: Request;
  params: any;
}) {
  const formData = await request.formData();
}
