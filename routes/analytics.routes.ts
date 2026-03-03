import express from 'express'
import { getTagAnalytics } from '../controllers/getAnalytics'

const router=express.Router()

//to get analytics
router.get('/get-analytics',getTagAnalytics)


export default router