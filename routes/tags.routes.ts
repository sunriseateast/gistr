import express from 'express'
import { attachTags } from '../controllers/attachTags.ts'

const router=express.Router()

//to attach tags
router.get('/attach-tags',attachTags)

export default router