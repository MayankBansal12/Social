/** @format */
"use client";
import { Separator } from "@/components/ui/separator";
import { Dock, FilePenLine, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useFormStore, useProjectStore, useUserStore } from "@/global-store/store";
import useApi from "@/helpers/useApi";
import { FormType } from "@/types/type";
import { formatDate } from "@/helpers/format";
import { useToast } from "@/components/ui/use-toast";


const Forms = ({ params }: { params: { project_id: string } }) => {
  const [forms, setForms] = useState<FormType[]>([])
  const { user } = useUserStore()
  const { project } = useProjectStore()
  const { setForm } = useFormStore()
  const callApi = useApi()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [formName, setFormName] = useState("")
  const [heading, setHeading] = useState("")
  const { toast } = useToast()

  // create a new form using name and heading
  const createNewForm = async () => {
    if (!formName || !heading) {
      toast({
        title: "name/heading can't be empty!",
        description: "give your form a name and a heading and try again!",
      })
      return;
    }
    if (!user) {
      toast({
        title: "oops! couldn't create new form",
        description: "refresh and try again!",
      })
      return;
    }
    setLoading(true)

    try {
      const res = await callApi("/v1/form", "POST", { name: formName, heading, type: "long", projectId: params.project_id }, user.userId, user.clientSecret)

      if (res.data.success) {
        toast({
          title: "form created!",
          description: res.data.message.toLowerCase(),
        })
      } else {
        toast({
          title: "oops! couldn't create new form",
          description: res.data.message.toLowerCase(),
        })
      }
    } catch (error: any) {
      console.error("error creating form: ", error)
      toast({
        title: "oops! couldn't create new form",
        description: error?.response?.data?.message || "error, try again!",
      })
    } finally {
      setLoading(false)
    }
  }

  // edit the project name and desc
  const editProject = async () => {
    if (!name) {
      toast({
        title: "name can't be empty!",
        description: "give your project a name and try again!",
      })
      return;
    }
    if (!user) {
      toast({
        title: "oops! couldn't create new project",
        description: "refresh and try again!",
      })
      return;
    }

    setLoading(true)

    try {
      const res = await callApi("/v1/project" + params.project_id, "PUT", { name, desc }, user.userId, user.clientSecret)

      if (res.data.success) {
        toast({
          title: "project created!",
          description: res.data.message.toLowerCase(),
        })
      } else {
        toast({
          title: "oops! couldn't create new project",
          description: res.data.message.toLowerCase(),
        })
      }
    } catch (error: any) {
      console.error("error creating project: ", error)
      toast({
        title: "oops! couldn't create new project",
        description: error?.response?.data?.message || "error, try again!",
      })
    } finally {
      setLoading(false)
    }
  }

  // fetch all forms related to that user
  const fetchForms = async () => {
    if (!user) {
      return
    }

    try {
      const res = await callApi("/v1/form?projectId=" + params.project_id, "GET", {}, user.userId, user.clientSecret)
      console.log("project forms:", res)
      if (res.data.success) {
        setForms(res.data.data)
      }
    } catch (error: any) {
      console.error("error creating project: ", error)
    }
  };

  useEffect(() => {
    console.log("project: ", project)
    setName(project?.name ?? "")
    setDesc(project?.desc ?? "")
  }, [project])

  useEffect(() => {
    fetchForms()
  }, [user, params.project_id])

  return (
    <div className="flex flex-col w-full h-full dark:bg-dark-secondary dark:text-white px-10">
      <div className="flex gap-4 justify-between items-center">
        <h1 className="pt-1 pb-3 text-xl font-semibold">project forms</h1>
        <div className="flex gap-4 items-center">
          <Dialog>
            <DialogTrigger className="text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white transition-all">
              edit project
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>edit project</DialogTitle>
                <DialogDescription>
                  edit project name and project description here
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    project name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-right">
                    project desc
                  </Label>
                  <Input
                    id="desc"
                    className="col-span-3"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={editProject} className="bg-accent-link hover:bg-accent-buttonhover transition-all py-1 px-4 rounded-full text-white" disabled={loading}>edit project</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className="bg-accent-link hover:bg-accent-buttonhover transition-all py-1 px-4 rounded-full text-white">
              add new form
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>create new form</DialogTitle>
                <DialogDescription>
                  create new form and keep a track of all feedback with that.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    form name
                  </Label>
                  <Input
                    id="name"
                    placeholder="new form"
                    className="col-span-3"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="heading" className="text-right">
                    form heading
                  </Label>
                  <Input
                    id="heading"
                    placeholder="form heading..."
                    className="col-span-3"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={createNewForm} className="bg-accent-link hover:bg-accent-buttonhover transition-all py-1 px-4 rounded-full text-white" disabled={loading}>create new form</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {forms.length === 0 ? (
        <div className="shadow-lg my-4 px-4 py-8 border border-light-primary dark:border-light-primary rounded-sm text-center">
          <p>no feedback received yet?</p>
          <p>no worries! we&apos;ll help you out!</p>
          <p>
            or if you haven&apos;t created any feedback forms yet?{" "}
            <Link href="/dashboard/projects" className="text-accent-link">
              get started here.
            </Link>
          </p>
        </div>
      ) : (
        <div className="md:gap-4 lg:gap-5 md:grid grid-cols-2">
          {forms.map((form) => (
            <Link href={"/dashboard/projects/" + params.project_id + "/" + form._id} key={form._id} onClick={() => setForm(form)}>
              <div className="shadow-lg my-4 p-6 border border-light-primary rounded-sm hover:cursor-pointer hover:border-white transition-all">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <Dock size={20} />
                    <p className="font-semibold text-xl">
                      {form?.name ?? ""}
                    </p>
                  </div>

                  <ExternalLink />
                </div>
                <div className="my-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    {form?.heading ?? ""}
                  </p>
                </div>
                <div className="mb-2 flex gap-2">
                  <p className="font-medium">total feedback received: <span className="font-semibold">n/a</span></p>
                  <Separator orientation="vertical" className="h-5 bg-black dark:bg-white" />
                  <p>overall rating: <span className="font-semibold">n/a</span></p>
                </div>

                <div>
                  <p className="text-right text-sm text-gray-400">
                    created: {formatDate(form.createdDate)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* {deleteModal && (
        <div className="top-0 left-0 fixed flex justify-center items-center bg-gray-500 bg-opacity-50 w-full h-full">
          <div className="dark:bg-dark-secondary px-5 py-5">
            <p className="text-lg dark:text-white">
              are you sure you want to delete this project ⚠️
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className="bg-accent-link hover:bg-red-600 mr-2 px-4 py-2 rounded-full text-white"
                onClick={deleteHandler}
              >
                Yes
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full text-gray-800"
                onClick={() => setDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Forms
