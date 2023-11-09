import * as Yup from 'yup';

 export const validationSchema = Yup.object({
  name: Yup.string().required('Ad boş geçilemez'),
  email: Yup.string().email('Geçerli bir email girin').required('Email boş geçilemez'),
  password: Yup.string().required('Şifre boş geçilemez') 
})